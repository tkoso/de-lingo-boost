package com.tkoso.de_lingo_boost.service;

import com.tkoso.de_lingo_boost.model.User;
import com.tkoso.de_lingo_boost.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(("User is not found")));
    }

//    public User getUserByUsername(String username) {
//
//    }
}
