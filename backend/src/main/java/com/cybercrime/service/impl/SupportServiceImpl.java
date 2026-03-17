package com.cybercrime.service.impl;

import com.cybercrime.dto.SupportTicketDto;
import com.cybercrime.dto.SupportTicketRequest;
import com.cybercrime.entity.SupportTicket;
import com.cybercrime.entity.TicketStatus;
import com.cybercrime.entity.User;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.SupportTicketRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.SupportService;
import com.cybercrime.util.MapperUtil;
import com.cybercrime.util.SecurityUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupportServiceImpl implements SupportService {
    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;

    @Override
    public SupportTicketDto create(SupportTicketRequest request) {
        User user = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SupportTicket ticket = supportTicketRepository.save(SupportTicket.builder()
                .user(user)
                .subject(request.getSubject())
                .message(request.getMessage())
                .status(TicketStatus.OPEN)
                .build());
        return MapperUtil.toSupportTicketDto(ticket);
    }

    @Override
    public List<SupportTicketDto> myTickets() {
        User user = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return supportTicketRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(MapperUtil::toSupportTicketDto).toList();
    }
}
