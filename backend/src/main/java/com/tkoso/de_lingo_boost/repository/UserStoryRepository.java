package com.tkoso.de_lingo_boost.repository;

import com.tkoso.de_lingo_boost.model.Story;
import com.tkoso.de_lingo_boost.model.User;
import com.tkoso.de_lingo_boost.model.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStoryRepository extends JpaRepository<UserStory, Long> {
    List<UserStory> findByUser(User user);
    boolean existsByUserAndStory(User user, Story story);
}
