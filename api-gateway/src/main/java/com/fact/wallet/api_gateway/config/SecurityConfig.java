/** This package contains security configuration classes for the API Gateway. */
package com.fact.wallet.api_gateway.config;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.cloud.gateway.config.GlobalCorsProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/** Security configuration for the API Gateway. */
// CHECKSTYLE:OFF DesignForExtension
@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

  /**
   * Configures the security filter chain.
   *
   * @param serverHttpSecurity the server HTTP security object (must be final).
   * @param corsProperties the CORS properties (must be final).
   * @return a configured {@link SecurityWebFilterChain}.
   */
  @Bean
  public SecurityWebFilterChain springSecurityFilterChain(
      final ServerHttpSecurity serverHttpSecurity, final GlobalCorsProperties corsProperties) {
    serverHttpSecurity
        .csrf(csrf -> csrf.disable())
        .cors(withDefaults())
        .authorizeExchange(
            exchange ->
                exchange
                    .pathMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                    .pathMatchers(HttpMethod.GET, "/")
                    .permitAll()
                    .anyExchange()
                    .authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()));
    return serverHttpSecurity.build();
  }
}
