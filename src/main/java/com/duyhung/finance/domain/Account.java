package com.duyhung.finance.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String description;

    @Column(name = "balance", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double balance;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Transaction> transactions;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;
    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }
}
