package com.chat.api.controller;

import com.chat.api.dto.*;
import com.chat.api.model.Role;
import com.chat.api.model.User;
import com.chat.api.service.RoleService;
import com.chat.api.service.TokenService;
import com.chat.api.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    RoleService roleService;

    @Autowired
    private AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final ResponseDto responseDto = new ResponseDto();
    public UserController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping(value = "/login", produces = { "application/json" })
    public ResponseDto login(@RequestBody UserLoginDto userLoginDto, HttpServletRequest req) {
        String token = tokenService.generateToken(
                userService.userAuthentication(
                        userLoginDto.getEmail(),
                        userLoginDto.getPassword(),
                        req,
                        authenticationManager
                )
        );
        responseDto.setResponse(token);
        return responseDto;
    }

    @PostMapping(value = "/register", produces = { "application/json" })
    public ResponseDto register(@RequestBody UserRegisterDto userRegisterDto) {
        try {
            userService.saveUser(userRegisterDto);
            responseDto.setResponse("success");
            return responseDto;
        } catch (Exception e) {
            responseDto.setResponse("error");
            return responseDto;
        }
    }

    @GetMapping(value = "/me", produces = { "application/json" })
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            return new ResponseEntity<User>(user, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/role-user", produces = { "application/json" })
    public ResponseEntity<Role> getUserRole(Authentication authentication) {
        try {
            Role role = roleService.getRoleByUserId(authentication.getName());
            return new ResponseEntity<Role>(role, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<Role>(HttpStatus.NOT_FOUND);
        }
    }
}
