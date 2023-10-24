import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

Future<void> initNotifications() async{
  const AndroidInitializationSettings initializationSettingsAndroid =
      AndroidInitializationSettings('icon');
  const DarwinInitializationSettings initializationSettingsIOS = DarwinInitializationSettings(

  );

  const InitializationSettings initializationSettings = InitializationSettings(
    android:  initializationSettingsAndroid,
    iOS: initializationSettingsIOS,
  );

  await flutterLocalNotificationsPlugin.initialize(initializationSettings);
}

Future<void> showNotification() async {
  const AndroidNotificationDetails androidNotificationDetails =
  AndroidNotificationDetails('channel_id', 'channel_name');

  const DarwinNotificationDetails darwinNotificationDetails = DarwinNotificationDetails();

  const NotificationDetails notificationDetails =NotificationDetails(
    android: androidNotificationDetails,
  );

  FirebaseFirestore db = FirebaseFirestore.instance;
  db.collection('alerts').where('created', isGreaterThan: DateTime.timestamp().subtract(const Duration(days: 1))).snapshots().listen((event) {
  for (var change in event.docChanges) {
    switch (change.type) {
      default:
        Map<String, dynamic> data =change.doc.data()!;
        var workers = data['workers'].toString();
        var time = data['time'].toString();
        var decibels = data['db'].toString();
        var place = data['place'];
        flutterLocalNotificationsPlugin.show(1, 'Alerta', '$workers personas expuestas por $time [s] a $decibels [db] en $place', notificationDetails);
        break;
    }
  }
});


 

}