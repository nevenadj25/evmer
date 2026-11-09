package rs.pupin.evmer.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.enums.CalibrationStatus;
import rs.pupin.evmer.enums.EquipmentStatus;
import rs.pupin.evmer.enums.ReservationStatus;
import rs.pupin.evmer.mapper.*;
import rs.pupin.evmer.model.*;
import rs.pupin.evmer.repository.*;

import java.util.List;

@Service
@AllArgsConstructor
public class IndexService {
    private final EquipmentRepository equipmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final ReservationRepository reservationRepository;
    private final EquipmentHistoryRepository equipmentHistoryRepository;
    private final AssignmentMapper assignmentMapper;
    private final CalibrationMapper calibrationMapper;
    private final ReservationMapper reservationMapper;
    private final EquipmentHistoryMapper equipmentHistoryMapper;
    private final CurrentUserService currentUserService;

    public EquipmentSummaryIndex getSummary() {
        return new EquipmentSummaryIndex(
                equipmentRepository.count(),
                equipmentRepository.countByStatus(EquipmentStatus.SLOBODAN),
                equipmentRepository.countByStatus(EquipmentStatus.NEISPRAVAN),
                equipmentRepository.countByStatus(EquipmentStatus.ZAUZET)
        );
    }

    public Page<UserAssignmentIndex> getAssignments(Pageable pageable) {
        User user = currentUserService.getAuthenticatedUser();

        return assignmentRepository
                .findByUserIdAndActiveAssignmentTrue(user.getId(), pageable)
                .map(assignmentMapper::toDto);
    }

    public Page<ActiveReservationIndex> getReservations(Pageable pageable) {
        return reservationRepository
                .findByStatus(ReservationStatus.AKTIVNA, pageable)
                .map(reservationMapper::toDto);
    }

    public Page<CalibrationIndex> getCalibrations(Pageable pageable) {
        return equipmentRepository
                .findByCalibrationStatusIn(
                        List.of(CalibrationStatus.USKORO_ISTICE, CalibrationStatus.ISTEKLA),
                        pageable
                )
                .map(calibrationMapper::toCalibrationIndexDto);
    }

    public Page<UserActivityIndex> getActivities(Pageable pageable) {
        User user = currentUserService.getAuthenticatedUser();

        return equipmentHistoryRepository
                .findByUserId(user.getId(), pageable)
                .map(equipmentHistoryMapper::toDto);
    }
}
