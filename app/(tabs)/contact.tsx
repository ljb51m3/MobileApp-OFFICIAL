// import { View, Text, FlatList, StyleSheet } from "react-native";

// const doctorInfo = [
//   {
//     id: "1",
//     doctorName: "Dr. Example",
//     doctorPhone: "+1(234)567-8910",
//     doctorEmail: "example@gmail.com",
//   },
//   {
//     id: "2",
//     doctorName: "Dr. Ejemplo",
//     doctorPhone: "+2(345)678-9101",
//     doctorEmail: "ejemplo@gmail.com",
//   },
//   {
//     id: "3",
//     doctorName: "Dr. Exemple",
//     doctorPhone: "+3(456)789-1012",
//     doctorEmail: "exemple@gmail.com",
//   },
// ];

// const DoctorItem = ({
//   doctorName,
//   doctorPhone,
//   doctorEmail,
// }: {
//   doctorName: string;
//   doctorPhone: string;
//   doctorEmail: string;
// }) => (
//   <View style={styles.doctorItem}>
//     <Text style={styles.doctorName}>{doctorName}</Text>
//     <Text style={styles.doctorContact}>{doctorPhone}</Text>
//     <Text style={styles.doctorEmail}>{doctorEmail}</Text>
//   </View>
// );

// const ContactYourDoctor = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Contact Your Doctor</Text>
//       <FlatList
//         data={doctorInfo}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <DoctorItem
//             doctorName={item.doctorName}
//             doctorPhone={item.doctorPhone}
//             doctorEmail={item.doctorEmail}
//           />
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#333",
//   },
//   doctorItem: {
//     backgroundColor: "#fff",
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   doctorName: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//   },
//   doctorContact: {
//     fontSize: 16,
//     color: "#666",
//     marginTop: 4,
//   },
//   doctorEmail: {
//     fontSize: 16,
//     color: "#666",
//     marginTop: 4,
//   },
// });

// export default ContactYourDoctor;
