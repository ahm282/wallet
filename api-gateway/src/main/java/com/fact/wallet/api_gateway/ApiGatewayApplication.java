package com.fact.wallet.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.reactive.config.EnableWebFlux;

@SpringBootApplication
@EnableWebFlux
public class ApiGatewayApplication {
  public static void main(final String[] args) {
    SpringApplication.run(ApiGatewayApplication.class, args);
  }
}
