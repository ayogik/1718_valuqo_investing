//
//  homepageViewController.swift
//  Valuqo App1
//
//  Created by A K on 6/7/18.
//  Copyright © 2018 Valuqo. All rights reserved.
//

import UIKit
import MapKit

class homepageViewController: UIViewController , CLLocationManagerDelegate{
    
    @IBOutlet weak var lbl_Balance: UILabel!
    @IBOutlet weak var map_disp: MKMapView!
    @IBOutlet weak var btn_Update: UIBarButtonItem!
    
    
    
    
    var locationManager = CLLocationManager() //creates location manager object
    var prev_locations = [CLLocationCoordinate2D]()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    @IBAction func locationGrab(_ sender: UIBarButtonItem) { //when authorized, find location to within 10m
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        
        map_disp.showsUserLocation = true
    }
    
    func locationManager(manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) { // update map
        let userLocation:CLLocation = locations[0] as CLLocation
        
        manager.stopUpdatingLocation()
            
        let coordinates = CLLocationCoordinate2D(latitude: userLocation.coordinate.latitude,longitude: userLocation.coordinate.longitude)
        
        prev_locations.append(coordinates)
        
        let span = MKCoordinateSpanMake(0.2,0.2)
        let region = MKCoordinateRegion(center: coordinates, span: span)
        
        map_disp.setRegion(region, animated: true)
    }
    
    func plotRoute() {
        // once coordinates are requested from web server, plot route using Apple Maps
    }

}
