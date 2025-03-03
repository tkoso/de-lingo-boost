package com.tkoso.de_lingo_boost.controller;

import com.tkoso.de_lingo_boost.model.Story;
import com.tkoso.de_lingo_boost.model.User;
import com.tkoso.de_lingo_boost.model.UserStory;
import com.tkoso.de_lingo_boost.repository.StoryRepository;
import com.tkoso.de_lingo_boost.repository.UserRepository;
import com.tkoso.de_lingo_boost.repository.UserStoryRepository;
import com.tkoso.de_lingo_boost.service.StoryService;
import com.tkoso.de_lingo_boost.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

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

    @PostMapping("/save_story")
    public ResponseEntity<?> saveStory(@RequestParam Long storyId) {
        // retrieve the username from SecurityContext set by JwtFilter
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Story not found"));

        if (userStoryRepository.existsByUserAndStory(user, story)) {
            return ResponseEntity.badRequest().body("Story already saved for this user");
        }

        UserStory userStory = new UserStory();
        userStory.setUser(user);
        userStory.setStory(story);
        userStoryRepository.save(userStory);

        return ResponseEntity.ok("Story saved for user!");
    }
}
