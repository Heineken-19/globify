package com.globify.security;

import com.globify.entity.User;
import com.globify.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class
UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + email);
        }

        GrantedAuthority authority = new SimpleGrantedAuthority(
                "ROLE_" + (user.get().getRole() != null ? user.get().getRole().name() : "USER")
        );

        return new org.springframework.security.core.userdetails.User(
                user.get().getEmail(),  // Felhasználónév (email)
                user.get().getPassword(),  // Kódolt jelszó
                Collections.singletonList(authority) // Jogosultságok listája
        );
    }
}
