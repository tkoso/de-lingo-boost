package com.tkoso.de_lingo_boost.repository;

import com.tkoso.de_lingo_boost.model.User;
import com.tkoso.de_lingo_boost.model.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStoryRepository extends JpaRepository<UserStory, Long> {
}
