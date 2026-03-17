package com.cybercrime.service;

public interface AuditService {
    void log(String action, String entityName, String entityId, String details);
}
