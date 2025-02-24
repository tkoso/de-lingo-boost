package com.tkoso.de_lingo_boost.controller;

import com.tkoso.de_lingo_boost.model.Story;
import com.tkoso.de_lingo_boost.model.User;
import com.tkoso.de_lingo_boost.repository.StoryRepository;
import com.tkoso.de_lingo_boost.service.StoryService;
import com.tkoso.de_lingo_boost.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {
    @Autowired
    private StoryService storyService;

    @Autowired
    private UserService userService;

    @GetMapping("/generate")
    public ResponseEntity<Story> generateStory() {
//        User user = userService.getUserByUsername(userDetails.getUsername());
        Story generatedStory = storyService.generateStory();
//        storyService.associateUserWithStory(user, generatedStory);
        return ResponseEntity.ok(generatedStory);
    }
}
