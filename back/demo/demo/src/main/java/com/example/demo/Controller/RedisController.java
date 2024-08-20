package com.example.demo.Controller;

import com.example.demo.Security.jwt.JWTUtil;
import com.example.demo.Service.Redis.RedisServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/redis")
@RequiredArgsConstructor
public class RedisController {

    private final RedisServiceImpl redisService;
    private final JWTUtil jwtUtil;

    @PostMapping("/set")
    public void setValue(@RequestBody Map<String, String> request) {
        String key = request.get("key");
        String value = request.get("value");
        redisService.setValues(key, value);
    }

    @PostMapping("/setWithExpiry")
    public void setValueWithExpiry(@RequestBody Map<String, Object> request) {
        String key = (String) request.get("key");
        String value = (String) request.get("value");
        long seconds = ((Number) request.get("seconds")).longValue();
        redisService.setValues(key, value, Duration.ofSeconds(seconds));
    }

    @GetMapping("/get")
    public String getValue(@RequestParam String key) {
        return redisService.getValue(key);
    }

    @DeleteMapping("/delete")
    public void deleteValue(@RequestParam String key) {
        redisService.deleteValue(key);
    }

    @PostMapping("/blacklist/add")
    public void addToBlacklist(@RequestBody Map<String, String> request) {
        String jwt = request.get("jwt");
        Date expiration = jwtUtil.getExpirationDate(jwt);
        redisService.addToBlacklist(jwt, expiration);
    }

    @GetMapping("/blacklist/check")
    public ResponseEntity<Boolean> isBlacklisted(@RequestBody Map<String, String> request) {
        String jwt = request.get("jwt");

        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7); // "Bearer " 제거
        }else {
            return ResponseEntity.badRequest().body(null);
        }
        boolean isBlacklisted = redisService.isBlacklisted(jwt);
        return ResponseEntity.ok(isBlacklisted);
    }
}
