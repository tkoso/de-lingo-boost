package com.tkoso.de_lingo_boost.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
//@AllArgsConstructor
@Table(name = "stories")
public class Story {
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    @Getter
    @Column(columnDefinition = "TEXT")
    private String content;

    @Getter
    @Column(columnDefinition = "TEXT")
    private String translation;

    @Getter
    @Column(columnDefinition = "TEXT")
    private String wordTranslations;

    @Getter
    @Column(columnDefinition = "TEXT")
    private String questions;

    @Getter
    private String level;

    @Getter
    private LocalDateTime createdAt;

    public Story(Long id, String topic, String content, String translation, String wordTranslations, String questions, String level, LocalDateTime createdAt) {
        this.content = content;
        this.translation = translation;
        this.wordTranslations = wordTranslations;
        this.questions = questions;
        this.level = level;
        this.createdAt = createdAt;
        this.topic = topic;
    }




}