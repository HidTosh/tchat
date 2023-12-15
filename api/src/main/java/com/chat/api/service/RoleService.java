package com.chat.api.service;

import com.chat.api.model.Role;
import com.chat.api.model.User;
import com.chat.api.repository.RoleRepository;
import com.chat.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    public Role getRoleByUserId(String email) {
        return roleRepository.findByUserId(userRepository.findByEmail(email).getId());
    }
}
