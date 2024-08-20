//package com.example.demo.Alarm.Service;
//
//import com.example.demo.Alarm.DTO.AlarmDTO;
//import com.example.demo.Alarm.Entity.Alarm;
//import com.example.demo.Repository.AlarmRepository;
//import com.example.demo.Repository.MemberRepository;
//import com.example.demo.Security.auth.CustomUserDetails;
//import com.example.demo.entity.Member;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class AlarmService {
//    private final MemberRepository memberRepository;
//    private final AlarmRepository alarmRepository;
//
//    public List<AlarmDTO> myAlarmList(CustomUserDetails customUserDetails) {
//        Member member = memberRepository.findByUsername(customUserDetails.getUsername());
//
//        List<Alarm> alarms = alarmRepository.findByMember(member);
//
//        List<AlarmDTO> alarmDTOS = new ArrayList<>();
//
//        for(int i=0; i<alarms.size(); i++){
//            Alarm alarm = alarms.get(i);
//            AlarmDTO alarmDTO = new AlarmDTO();
//            alarmDTO.setMessage(alarm.getMessage());
//            alarmDTO.setBoardId(alarm.getBoard1().getId());
//            alarmDTO.setRead(alarm.isRead());
//        }
//
//        return alarmDTOS;
//    }
//}
