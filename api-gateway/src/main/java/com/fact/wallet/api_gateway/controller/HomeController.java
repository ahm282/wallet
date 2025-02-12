/** This package contains controllers for the API Gateway. */
package com.fact.wallet.api_gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller for handling home page requests. */
@RestController
@RequestMapping("/")
public final class HomeController {
  /**
   * Returns a welcome message.
   *
   * @return a String containing a welcome message.
   */
  @GetMapping
  public String home() {
    return "Wallet's API Gateway is operational! 🚀";
  }
}
