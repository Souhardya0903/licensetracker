package com.project.service;

import com.project.entity.AuditLog;
import com.project.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void logAction(String action, String item, String performedBy) {
        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .item(item)
                .performedBy(performedBy)
                .build();
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getRecentActivity(int limit) {
        return auditLogRepository.findTopNByOrderByTimestampDesc(limit);
    }
}
