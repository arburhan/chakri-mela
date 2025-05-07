/* eslint-disable */
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import React from 'react';

const SingleDetailsLoading = () => {
    return (
        <Card className="sticky top-8 animate-pulse bg-black text-white">
            <CardHeader>
                <div className="h-6 bg-black rounded w-1/3"></div>
            </CardHeader>
            <Divider className="border-gray-700" />
            <CardBody className="space-y-4">
                <div className="h-5 bg-black rounded w-3/4"></div>
                <div className="h-16 bg-black rounded w-full"></div>
                <div className="h-4 bg-black rounded w-1/2"></div>
                <div className="h-4 bg-black rounded w-1/3"></div>
                <div className="h-4 bg-black rounded w-2/5"></div>
                <div className="h-4 bg-black rounded w-1/4"></div>
                <div>
                    <div className="h-4 bg-black rounded w-1/6 mb-2"></div>
                    <div className="flex flex-wrap gap-2">
                        <div className="h-6 bg-black rounded w-16"></div>
                        <div className="h-6 bg-black rounded w-20"></div>
                        <div className="h-6 bg-black rounded w-24"></div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default SingleDetailsLoading;