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

@CrossOrigin(origins = "http://localhost:5173") // that's the vite's default port
@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {
    @Autowired
    private StoryService storyService;

    @Autowired
    private UserService userService;

    @GetMapping("/generate")
    public ResponseEntity<Story> generateStory(
            @RequestParam String level,
            @RequestParam(defaultValue = "whatever you make up") String topic
    ) {
//        User user = userService.getUserByUsername(userDetails.getUsername());
        Story generatedStory = storyService.generateStory(level, topic);
//        storyService.associateUserWithStory(user, generatedStory);
        return ResponseEntity.ok(generatedStory);
    }
}
