package com.project.service;

public interface AuditService {
    void logAction(String action, String item, String performedBy);
}
