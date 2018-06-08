//
//  ViewController.swift
//  Valuqo App1
//
//  Created by A K on 6/4/18.
//  Copyright © 2018 Valuqo. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var username_entry: UITextField!
    
    @IBOutlet weak var password_entry: UITextField!
    
    @IBOutlet weak var btn_login: UIButton!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    var username : String?
    var password : String?
    
    
    @IBAction func username_entered(_ sender: Any) {
        
        username = username_entry.text
        
    }
    
    @IBAction func password_entered(_ sender: Any) {
        
        password = password_entry.text
        
    }
    
    

}

