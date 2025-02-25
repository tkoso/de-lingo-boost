package com.tkoso.de_lingo_boost.service;

import com.tkoso.de_lingo_boost.model.Story;
import com.tkoso.de_lingo_boost.repository.StoryRepository;
import com.tkoso.de_lingo_boost.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StoryService {
    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OpenRouterService openRouterService;

    public Story generateStory(String level) {
        // maybe some check if level is CEFR Level
        Mono<String> mono = openRouterService.fetchStory(level, "Erzaehle mal wie die Sonne funktioniert");
        String content = mono.block();
        Story story = new Story(0L, content, level, LocalDateTime.now());
        Story savedStory = storyRepository.save(story);

        return savedStory;
    }

}
