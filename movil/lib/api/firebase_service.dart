import 'package:cloud_firestore/cloud_firestore.dart';

FirebaseFirestore db = FirebaseFirestore.instance;

Future<List> getNotifications() async {
  List notifications = [];
  CollectionReference collectionReferenceNotification = db.collection('alerts');

  QuerySnapshot queryNotifications = await collectionReferenceNotification.get();

  queryNotifications.docs.forEach((document) {
    notifications.add(document);
   });

  return notifications;
} 
