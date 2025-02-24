package com.tkoso.de_lingo_boost.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ExternalStoryService {
    private final WebClient webClient;

    public ExternalStoryService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("...").build();
    }

    public String fetchStory() {
        return webClient.get()
                .uri("...")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
