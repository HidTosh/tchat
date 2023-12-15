package org.example.back.service;

import org.example.back.dto.UserRegisterDto;
import org.example.back.dto.UserUpdateDto;
import org.example.back.model.Role;
import org.example.back.model.User;
import org.example.back.repository.RoleRepository;
import org.example.back.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.regex.Pattern;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    public String defaultRole = "ROLE_USER"; // Change role if needed
    public int enabledUser = 1; // By default new user is enabled
    public PasswordEncoder passwordEncoder = passwordEncoder();

    public Authentication userAuthentication(
            String emailUsername,
            String password,
            HttpServletRequest req,
            AuthenticationManager authenticationManager
    ) {
        String email;
        if (!isValidEmail(emailUsername)) {
            User user = getUserByName(emailUsername);
            email = (user != null) ? user.getEmail() : emailUsername;
        } else {
            email = emailUsername;
        }

        UsernamePasswordAuthenticationToken authReq =
                new UsernamePasswordAuthenticationToken(email, password);
        Authentication auth = authenticationManager.authenticate(authReq);

        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(auth);
        HttpSession session = req.getSession(true);
        session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, securityContext);
        return auth;
    }

    public void saveUser(UserRegisterDto userRegisterDto) {
        if (getUserByEmail(userRegisterDto.getEmail()) == null) {
            User user = userRepository.save(
                    createUser(userRegisterDto)
            );
            roleRepository.save(
                    createRole(user)
            );
        }
    }

    public void updateUser(UserUpdateDto userUpdateDto, User authUser) {
        User user = new User();
        user.setId(authUser.getId());
        user.setName(userUpdateDto.getName());
        user.setEmail(userUpdateDto.getEmail());
        user.setPassword(authUser.getPassword());
        user.setUpdatedAt(OffsetDateTime.now());
        user.setCreatedAt(authUser.getCreatedAt());
        userRepository.save(user);
    }

    private Role createRole(User user) {
        Role role = new Role();
        role.setUser(user);
        role.setAuthority(defaultRole);
        role.setEnabled(enabledUser);
        return role;
    }

    private User createUser(UserRegisterDto userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
        return user;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByName(String name) {
        return userRepository.findByName(name);
    }
    public boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\."+
                "[a-zA-Z0-9_+&*-]+)*@" +
                "(?:[a-zA-Z0-9-]+\\.)+[a-z" +
                "A-Z]{2,7}$";

        Pattern pat = Pattern.compile(emailRegex);
        if (email == null)
            return false;
        return pat.matcher(email).matches();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
