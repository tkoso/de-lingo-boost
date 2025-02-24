package com.tkoso.de_lingo_boost.repository;

import com.tkoso.de_lingo_boost.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryRepository extends JpaRepository<Story, Long> {
}
