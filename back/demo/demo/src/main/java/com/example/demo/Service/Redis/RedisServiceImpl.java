package com.example.demo.Service.Redis;

import com.example.demo.Service.Redis.RedisService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.internal.Logger;

import java.time.Duration;
import java.util.Date;


@Service
@RequiredArgsConstructor
@Slf4j
public class RedisServiceImpl implements RedisService{
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Redis 값을 등록/수정합니다.
     *
     * @param {String} key : redis key
     * @param {String} value : redis value
     * @return {void}
     */
    @Override
    public void setValues(String key, String value) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        values.set(key, value);
    }

    /**
     * Redis 값을 등록/수정합니다.
     *
     * @param {String}   key : redis key
     * @param {String}   value: redis value
     * @param {Duration} duration: redis 값 메모리 상의 유효시간.
     * @return {void}
     */
    @Override
    public void setValues(String key, String value, Duration duration) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        values.set(key, value, duration);
    }

    /**
     * Redis 키를 기반으로 값을 조회합니다.
     *
     * @param {String} key : redis key
     * @return {String} redis value 값 반환 or 미 존재시 빈 값 반환
     */
    @Override
    public String getValue(String key) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        if (values.get(key) == null) return "";
        return String.valueOf(values.get(key));
    }

    /**
     * Redis 키값을 기반으로 row 삭제합니다.
     *
     * @param key
     */
    @Override
    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }

    public void addToBlacklist(String jwt, Date expiration) {
        SetOperations<String, Object> setOps = redisTemplate.opsForSet();
        setOps.add("JWT_BLACKLIST", jwt);
        long timeToExpire = expiration.getTime() - System.currentTimeMillis();
        if (timeToExpire > 0) {
            redisTemplate.expire("JWT_BLACKLIST", Duration.ofMillis(timeToExpire));
        }
    }

    public void tempRegisterEmail(String Email){
        SetOperations<String, Object> setOps = redisTemplate.opsForSet();
        setOps.add("temp_email", Email);
        redisTemplate.expire("temp_email", Duration.ofSeconds(60 * 5));

    }



    public boolean isBlacklisted(String jwt) {
        try {
            SetOperations<String, Object> setOps = redisTemplate.opsForSet();
            return setOps.isMember("JWT_BLACKLIST", jwt);
        } catch(Exception e){
            log.error("블랙리스트 jwt 확인중 에러 발생 " + e.getMessage());
            throw e;
        }
    }

    public Boolean tempCheckEmail(String email) {
        try {
            SetOperations<String, Object> setOps = redisTemplate.opsForSet();
            return setOps.isMember("temp_email", email);
        } catch(Exception e){
            log.error("인증 이메일 확인 중 오류 발생 " + e.getMessage());
            throw e;
        }
    }
}
