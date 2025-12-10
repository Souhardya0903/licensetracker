/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.project.dto.AuditLogDto;
import com.project.entity.AuditLog;
import com.project.repository.AuditLogRepository;
import com.project.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AuditLogServiceImpl
implements AuditLogService {
    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void logAction(String action, String item, String performedBy) {
        AuditLog log = AuditLog.builder().action(action).item(item).performedBy(performedBy).build();
        this.auditLogRepository.save(log);
    }

    @Override
    public Page<AuditLogDto> getAllLogs(Pageable pageable) {
        return this.auditLogRepository.findAll(pageable).map(this::convertToDto);
    }

    private AuditLogDto convertToDto(AuditLog auditLog) {
        return AuditLogDto.builder().id(auditLog.getId()).action(auditLog.getAction()).details(auditLog.getItem()).username(auditLog.getPerformedBy()).timestamp(auditLog.getTimestamp()).build();
    }
}
