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
    private OpenRouterService huggingFaceService;

    public Story generateStory() {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException(("User is not found")));

//        String generatedContent = generateStory();

        Mono<String> mono = huggingFaceService.fetchStory("A1", "Erzaehle mal wie die Sonne funktioniert");
        String content = mono.block();
        Story story = new Story(0L, content, "A1", LocalDateTime.now());
        Story savedStory = storyRepository.save(story);
//        userRepository.save(user);

        return savedStory;
    }

}
