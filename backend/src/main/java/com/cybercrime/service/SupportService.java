package com.cybercrime.service;

import com.cybercrime.dto.SupportTicketDto;
import com.cybercrime.dto.SupportTicketRequest;
import java.util.List;

public interface SupportService {
    SupportTicketDto create(SupportTicketRequest request);
    List<SupportTicketDto> myTickets();
}
