package com.tkoso.de_lingo_boost.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenRouterService {
    private final WebClient webClient;

    public OpenRouterService(
            WebClient.Builder webClientBuilder,
            @Value("${openrouter.api-url}") String apiUrl,
            @Value("${openrouter.api-key}") String apiKey
    ) {
        this.webClient = webClientBuilder.
                baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }


    public Mono<Map<String, String>> fetchStory(String level, String topic) {
        String prompt = String.format(
            "Erzaehle eine kurze Geschichte auf Deutsch (CEFR-Niveau %s). Thema: %s. Maximal 100 Woerter."
                + "Bitte fuege eine englische Uebersetzung nach einem '---' Zeichen hinzu."
                + "Am Ende, fuege eine JSON-Liste von Schluesselwoertern mit Uebersetzungen hinzu, getrennt durch ein zweites '---'."
                + "Beispiel: {\"words\": [{\"de\": \"Hund\", \"en\": \"dog\"}, ...]}"
                + "Zum Schluss, fuege 3 Multiple-Choice-Fragen im JSON-Format hinzu, getrennt durch ein drittes '---'."
                + "Jede Frage soll 3 Optionen (A, B, C) haben und eine korrekte Antwort. Beispiel: "
                + "{\"questions\":[{\"question\":\"...\",\"options\":{\"A\":\"...\",\"B\":\"...\",\"C\":\"...\"},\"correctAnswer\":\"A\"}]}",
            level.toUpperCase(),
            topic
        );
        Map<String, Object> requestBody = Map.of(
                "model", "deepseek/deepseek-r1:free",
                "messages", List.of(Map.of(  // OpenRouter uses OpenAI-compatible message format
                        "role", "user",
                        "content", prompt
                )),
//                "temperature", 0.7,
                "max_tokens", 3200
        );

        return webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                        if (message != null) {
                            String content = (String) message.get("content");
                            String[] parts = content.split("\\s*---\\s*");
                            String german = parts[0].trim();
                            String english = parts.length > 1 ? parts[1].trim() : "translation not available";

                            String wordMapJson = "{}";
                            if (parts.length > 2) {
                                ObjectMapper mapper = new ObjectMapper();
                                try {
                                    Map<String, Object> wordMap = mapper.readValue(parts[2], Map.class);
                                    wordMapJson = mapper.writeValueAsString(wordMap);
                                } catch (JsonProcessingException e) {
                                    wordMapJson = "{\"error\": \"invalid json format for keywords\"}";
                                }
                            }
                            String questionsJson = "[]";
                            if (parts.length > 3) {
                                try {
                                    questionsJson = parts[3].trim();
                                } catch (Exception e) {
                                    questionsJson = "{\"error\": \"invalid questions format\"}";
                                }
                            }
                            return Map.of(
                                "german", german,
                                "english", english,
                                "wordMap", wordMapJson,
                                "questions", questionsJson
                            );
                        }
                    }
                    throw new RuntimeException("Invalid response from OpenRouter API");
                });
    }
}
