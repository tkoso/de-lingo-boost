package com.tkoso.de_lingo_boost.service;

import com.tkoso.de_lingo_boost.model.Story;
import com.tkoso.de_lingo_boost.repository.StoryRepository;
import com.tkoso.de_lingo_boost.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StoryService {
    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OpenRouterService openRouterService;

    public Story generateStory(String level, String topic) {
        // TODO: some check if level is CEFR Level and topic isn't null or something
        Mono<Map<String, String>> mono = openRouterService.fetchStory(level, topic);
        Map<String, String> content = mono.block();
        assert content != null;
        Story story = new Story(0L, topic, content.get("german"), content.get("english"), level, LocalDateTime.now());

        return storyRepository.save(story);
    }

}
