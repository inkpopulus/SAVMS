package com.savms.controller;

import com.savms.entity.Account;
import com.savms.service.UserServiceUnused;
import com.savms.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * function：
 * author：lsr
 * date：2024/3/13 20:21
 */

@RestController
public class LoginController {

    @Autowired
    UserServiceUnused userServiceUnused;

    @GetMapping("/")
    public Result hello(){return Result.success("success");}

    @PostMapping("/login")
    public Result login(@RequestBody Account user){
        user = userServiceUnused.login(user);
        return Result.success(user);
    }

    @PostMapping("/register")
    public Result register(@RequestBody Account user){
        user = userServiceUnused.register(user);
        return Result.success(user);
    }
}
