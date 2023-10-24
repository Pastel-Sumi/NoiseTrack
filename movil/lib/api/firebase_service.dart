import 'package:cloud_firestore/cloud_firestore.dart';

FirebaseFirestore db = FirebaseFirestore.instance;


Future<List> getNotifications() async {
  db.settings =  const Settings(persistenceEnabled: true, cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED);
  List notifications = [];
  CollectionReference collectionReferenceNotification = db.collection('alerts');

  //Query realizada para la base de datos
  QuerySnapshot queryNotifications =  await collectionReferenceNotification.get();

  queryNotifications.docs.forEach((document) {
    notifications.add(document.data());
   });

  return notifications;
} 
