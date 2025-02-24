package com.tkoso.de_lingo_boost.service;

import com.tkoso.de_lingo_boost.model.Story;
import com.tkoso.de_lingo_boost.model.User;
import com.tkoso.de_lingo_boost.repository.StoryRepository;
import com.tkoso.de_lingo_boost.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StoryService {
    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private UserRepository userRepository;

    public Story generateStory() {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException(("User is not found")));

//        String generatedContent = generateStory();

        Story story = new Story(1L, "Es war einmal...", "A1", LocalDateTime.now());
        Story savedStory = storyRepository.save(story);
//        userRepository.save(user);

        return savedStory;
    }

}
