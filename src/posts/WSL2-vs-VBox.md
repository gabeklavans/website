---
date: 2020-10-13
title: HyperV versus VirtualBox... Who Will Win? 
---

#### HyperV wins.

If you're running Windows need to be using a VM for something (I use one for work), be very wary of HyperV. It clashes at an OS level with the systems used to run virtual machines, and renders them basically useless. Not only that, it will not be obvious that HyperV is the culprit, and can even surface different errors depending on the context.

The two main pieces of software that I've come across that enable HyperV and brick my VMs are WSL2 and Docker. If you install either of these, you will have to go and disable WSL in the Windows Optional Feature <insert ref> settings and also disable HyperV using bcedit (or gedit if you have Windows Pro)<insert ref>.

The symptoms of this unholy pairing for me personally were sporadic loss of keyboard input in my VM, or hanging on boot screens with no error (this was made especially annoying for my Luks encrypted disk).

It's a HyperV eat Virtualization world out there, tread lightly. 
