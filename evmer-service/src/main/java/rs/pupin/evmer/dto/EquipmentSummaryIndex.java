package rs.pupin.evmer.dto;

public record EquipmentSummaryIndex(
        long numTotalEquipment,
        long numAvailableEquipment,
        long numBrokenEquipment,
        long numAssignedEquipment
) {
}
