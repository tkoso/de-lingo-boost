package com.tkoso.de_lingo_boost.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

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
                    + "Bitte fuege eine englische Uebersetzung nach einem '---' Zeichen hinzu.",
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
                "max_tokens", 1600
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
                            return Map.of("german", german, "english", english);
                        }
                    }
                    throw new RuntimeException("Invalid response from OpenRouter API");
                });
    }
}
