import 'package:cloud_firestore/cloud_firestore.dart';

FirebaseFirestore db = FirebaseFirestore.instance;

Future<String> getPlace(String email)async{
  db.settings =  const Settings(persistenceEnabled: true, cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED);
  List notifications = [];
  Query<Map<String, dynamic>> collectionReferenceNotification = db.collection('workers').where('email', isEqualTo: email);
  QuerySnapshot queryNotifications =  await collectionReferenceNotification.get();
  String place='';
  for (var doc in queryNotifications.docs) {
    place = (doc['place']);
  }
  return place;
}

Future<List> getNotifications(String? place) async {
  db.settings =  const Settings(persistenceEnabled: true, cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED);
  List notifications = [];
  Query<Map<String, dynamic>> collectionReferenceNotification;
  if(place != null) {
    collectionReferenceNotification = db.collection('alerts').where('created', isGreaterThan: DateTime.timestamp().subtract(const Duration(days: 1))).where('place', isEqualTo: place);
  } else{
    collectionReferenceNotification = db.collection('alerts').where('created', isGreaterThan: DateTime.timestamp().subtract(const Duration(days: 1)));
  }
  //Query realizada para la base de datos
  QuerySnapshot queryNotifications =  await collectionReferenceNotification.get();

  queryNotifications.docs.forEach((document) {
    notifications.add(document.data());
   });

  return notifications;
}


