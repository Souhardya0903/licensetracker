package com.project.service;

import com.project.dto.AuditLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {
    void logAction(String action, String item, String performedBy);
    Page<AuditLogDto> getAllLogs(Pageable pageable);
}
