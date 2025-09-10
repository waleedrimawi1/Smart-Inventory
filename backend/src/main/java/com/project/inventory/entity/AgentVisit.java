package com.project.inventory.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "agent_visits")
public class AgentVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long visitRoundId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", referencedColumnName = "id", nullable = false)
    private User agent;

    @Column(name = "round_type", nullable = false)
    private String roundType;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public AgentVisit() {}

    public AgentVisit(User agent, String roundType, LocalDate visitDate, String notes) {
        this.agent = agent;
        this.roundType = roundType;
        this.visitDate = visitDate;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getVisitRoundId() { return visitRoundId; }
    public void setVisitRoundId(Long visitRoundId) { this.visitRoundId = visitRoundId; }

    public User getAgent() { return agent; }
    public void setAgent(User agent) { this.agent = agent; }

    public String getRoundType() { return roundType; }
    public void setRoundType(String roundType) { this.roundType = roundType; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}