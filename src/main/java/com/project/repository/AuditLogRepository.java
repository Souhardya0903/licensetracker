/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Query
 *  org.springframework.stereotype.Repository
 */
package com.project.repository;

import com.project.entity.AuditLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository
extends JpaRepository<AuditLog, Long> {
    @Query(value="SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?1", nativeQuery=true)
    public List<AuditLog> findTopNByOrderByTimestampDesc(int var1);
}
