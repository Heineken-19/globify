package com.globify.config;

import com.globify.security.JwtAuthenticationFilter;
import com.globify.security.JwtUtil;
import com.globify.security.UserAuthenticationProvider;
import com.globify.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import com.globify.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(List.of(authenticationProvider()));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new UserAuthenticationProvider(userDetailsService, passwordEncoder(), userRepository); // 🔹 Hiányzó paraméter hozzáadva
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        //Admin
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/coupons/reward").authenticated()

                        //Public
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
                        .requestMatchers("/api/files/**").permitAll()
                        .requestMatchers("/api/email/**").permitAll()
                        .requestMatchers("/uploads/products/**").permitAll()
                        .requestMatchers("/uploads/newsletter/**").permitAll()
                        .requestMatchers("/api/shipping/check").permitAll()
                        .requestMatchers("/api/shipping/**").permitAll()

                        //Other
                        .requestMatchers("/api/user/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/orders/guest-orders").hasAnyRole("USER", "GUEST")
                        .requestMatchers("/api/address/**").authenticated()

                        //Review
                        .requestMatchers("/api/reviews/**").permitAll()
                        .requestMatchers("/api/reviews/{userId}/{productId}").authenticated()
                        .requestMatchers("/api/reviews/{userId}/{reviewId}").authenticated()

                        //Favorite
                        .requestMatchers("/api/favorites/**").authenticated()

                        //Products
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/product-images/**").authenticated()

                        //Coupon
                        .requestMatchers("GET", "/api/coupons/apply").authenticated()
                        .requestMatchers("GET", "/api/coupons").permitAll()
                        .requestMatchers("POST", "/api/coupons").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/coupons/{id}").hasRole("ADMIN")

                        //Discount
                        .requestMatchers("GET", "/api/discounts/apply").authenticated()
                        .requestMatchers("GET", "/api/discounts").permitAll()
                        .requestMatchers("POST", "/api/discounts").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/discounts/{id}").hasRole("ADMIN")

                        //Subscribes
                        .requestMatchers("/api/newsletter/subscribe", "/api/newsletter/unsubscribe").permitAll()
                        .requestMatchers("/api/newsletter/send").hasRole("ADMIN")

                        .requestMatchers("/uploads/blog/**").permitAll()
                        .requestMatchers("/api/blogposts/**").permitAll()

                        //Paypal
                        .requestMatchers("/api/orders/create-payment", "/api/orders/success").authenticated()
                        .requestMatchers("/api/orders/capture-payment").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil, userDetailsService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



    // 🔹 CORS beállítás SecurityConfig-ban
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:3000", "https://jsglobal.hu")); // frontend URL(ek)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "PROPFIND"));
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));
        config.setExposedHeaders(List.of("Authorization")); // ha frontendnek kell auth token
        config.setMaxAge(3600L); // preflight cache ideje (1 óra)

        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
