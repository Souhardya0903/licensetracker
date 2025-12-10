/*
 * Decompiled with CFR 0.152.
 */
package com.project.service;

import com.project.dto.DeviceDto;
import java.io.ByteArrayInputStream;
import java.util.List;

public interface ReportsService {
    public List<DeviceDto> getNonCompliantDevices();

    public List<DeviceDto> findNonCompliantDevices();

    public String getNonCompliantDevicesCsv();

    public ByteArrayInputStream getNonCompliantDevicesPdf();
}
