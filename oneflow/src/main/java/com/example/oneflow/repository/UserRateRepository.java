package com.example.oneflow.repository;

import com.example.oneflow.model.UserRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRateRepository extends JpaRepository<UserRate, Long> {
    
    List<UserRate> findByUserId(Long userId);
    
    @Query("SELECT ur FROM UserRate ur WHERE ur.userId = :userId " +
           "AND ur.effectiveFrom <= :date " +
           "AND (ur.effectiveTo IS NULL OR ur.effectiveTo >= :date)")
    Optional<UserRate> findActiveRateForUserOnDate(
        @Param("userId") Long userId,
        @Param("date") LocalDate date
    );
    
    @Query("SELECT ur FROM UserRate ur WHERE ur.userId = :userId " +
           "AND ur.effectiveFrom <= CURRENT_DATE " +
           "AND (ur.effectiveTo IS NULL OR ur.effectiveTo >= CURRENT_DATE)")
    Optional<UserRate> findCurrentRateForUser(@Param("userId") Long userId);
}
