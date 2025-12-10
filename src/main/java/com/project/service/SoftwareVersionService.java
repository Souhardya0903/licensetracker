/*
 * Decompiled with CFR 0.152.
 */
package com.project.service;

import com.project.dto.SoftwareVersionDto;
import java.util.List;

public interface SoftwareVersionService {
    public List<SoftwareVersionDto> getSoftwareVersionsByDeviceId(String var1);

    public SoftwareVersionDto addSoftwareVersion(SoftwareVersionDto var1);
}
