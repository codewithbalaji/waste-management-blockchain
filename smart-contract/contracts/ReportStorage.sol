// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ReportStorage {
    struct Report {
        uint id;
        string imageHash;
        string location;
        string description;
        bool completed;
        address reporter;
    }

    uint public reportCount;
    mapping(uint => Report) public reports;
    
    event ReportCreated(uint id, string imageHash, string location, string description, bool completed, address reporter);
    event ReportCompleted(uint id, bool completed);

    function submitReport(string memory _imageHash, string memory _location, string memory _description) public {
        reportCount++;
        reports[reportCount] = Report(reportCount, _imageHash, _location, _description, false, msg.sender);
        emit ReportCreated(reportCount, _imageHash, _location, _description, false, msg.sender);
    }

    function completeReport(uint _id) public {
        require(reports[_id].reporter == msg.sender, "Only reporter can mark as completed");
        reports[_id].completed = true;
        emit ReportCompleted(_id, true);
    }
}