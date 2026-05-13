import { ScrollView, Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import HorizontalFillBar from '../../components/HorizontalFillBar'
import { History } from 'lucide-react-native'
import StudentSubjectContainer from '../../components/StudentSubjectContainer'
import Divider from '../../components/Divider'
import { colors } from '../../constants/colors'
import { useEffect, useState } from 'react'
import api from '../../util/apiClient'
import { ENDPOINTS } from '../../constants/api'
import Loading from '../../components/Loading'
import Toast from 'react-native-toast-message'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
export default function Index() {
  const [studentDetails, setStudentDetails] = useState({
    firstName: '',
    rollNo: '',
    semester: '',
    totalClasses: 0,
    attended: 0,
    subjectWiseAttendance: []
  });
  const [loading, setLoading] = useState(true);
  useFocusEffect(useCallback(() => {
    async function loadStudentDetails() {
      try {
        const data = await api.get(ENDPOINTS.STUDENT.OVERVIEW)
        setStudentDetails(data);
      }
      catch (error) {
        Toast.show({ type: "error", text1: "Cannot load Student details", text2: error.message });
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    }
    loadStudentDetails();
  }, [])
  )

  let overAllTotalAttendance = studentDetails.totalClasses
    ? Math.round((studentDetails.attended / studentDetails.totalClasses) * 100)
    : 0
  let fillColor = ''
  if (overAllTotalAttendance > 75) {
    fillColor = colors.success
  } else if (overAllTotalAttendance < 25) {
    fillColor = colors.danger
  } else {
    fillColor = colors.primary
  }
  if (loading) {
    return <Loading />
  }
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 min-w-full"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mx-8 mb-3 mt-10 text-4xl font-bold">
          Welcome, {studentDetails.firstName}
        </Text>
        <View className="flex flex-row mx-8">
          <Text className="mr-3 text-xl text-muted">Roll no: {studentDetails.rollNo}</Text>
          <Text className="text-xl text-muted">Semester: {studentDetails.semester}</Text>
        </View>
        <View style={styles.container}>
          <View className="flex flex-row items-center">
            <History size={45} color={colors.muted} />
            <View className="ml-2">
              <Text className="text-2xl font-semibold">Overview</Text>
              <Text className="text-muted my-1">Overall Attendance</Text>
            </View>
          </View>
          <Text className="min-w-full text-right mr-3 text-5xl font-bold mb-3">
            {overAllTotalAttendance}%
          </Text>
          <HorizontalFillBar
            fill={overAllTotalAttendance}
            fillStyle={{ backgroundColor: fillColor }}
          />
          <View className="flex flex-row mt-5 justify-between gap-x-3">
            <View className="flex-1 flex-row justify-between">
              <Text className="text-xl">Total Classes</Text>
              <Text className="text-xl font-semibold justify-end">{studentDetails.totalClasses}</Text>
            </View>
            <Divider orientation="vertical" margin={2} />
            <View className="flex-1 flex-row justify-between">
              <Text className="text-xl">Attended</Text>
              <Text className="text-xl font-semibold">{studentDetails.attended}</Text>
            </View>
          </View>
        </View>
        <Text className="text-xl font-semibold text-muted mx-8">Subjects</Text>
        {studentDetails.subjectWiseAttendance.map((subject, index) => (
          <StudentSubjectContainer
            key={subject.subjectCode}
            subjectCode={subject.subjectCode}
            subjectName={subject.subjectName}
            totalClasses={subject.totalClasses}
            attended={subject.attended}
          />
        ))}
        <View style={{ height: 80 }}></View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 30,
    shadowColor: colors.muted,
    shadowRadius: 8,
    shadowOpacity: 0.2,
    padding: 20,
  },
})
