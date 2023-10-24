import 'package:cloud_firestore/cloud_firestore.dart';

FirebaseFirestore db = FirebaseFirestore.instance;


Future<List> getNotifications() async {
  db.settings =  const Settings(persistenceEnabled: true, cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED);
  List notifications = [];
  Query<Map<String, dynamic>> collectionReferenceNotification = db.collection('alerts').where('created', isGreaterThan: DateTime.timestamp().subtract(const Duration(days: 1)));

  //Query realizada para la base de datos
  QuerySnapshot queryNotifications =  await collectionReferenceNotification.get();

  queryNotifications.docs.forEach((document) {
    notifications.add(document.data());
   });

  return notifications;
} 
