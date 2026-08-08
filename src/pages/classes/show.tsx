import React from 'react';
import { ClassDetails } from "@/types";
import { useShow } from "@refinedev/core";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary.ts";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    active: "default",
    inactive: "secondary",
    archived: "destructive",
};

const Show = () => {
    const { query } = useShow<ClassDetails>({ resource: "classes" });

    const classDetails = query.data?.data;
    const { isLoading, isError } = query;

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                <p className="state-message">
                    {isLoading
                        ? "Loading class info..."
                        : isError
                            ? "Failed to load class details..."
                            : "Class details not found"}
                </p>
            </ShowView>
        );
    }

    const {
        name,
        description,
        status,
        capacity,
        bannerCldPubId,
        teacher,
        department,
        subject,
    } = classDetails;

    const teacherName = teacher?.name ?? "Unknown";
    const teacherInitials = teacherName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || "NA")}`;

    return (
        <ShowView className="class-view class-show">
            <ShowViewHeader resource="classes" title="Class Details" />

            <div className="banner">
                {bannerCldPubId ? (
                    <AdvancedImage
                        alt={`${name} banner`}
                        cldImg={bannerPhoto(bannerCldPubId, name)}
                    />
                ) : (
                    <div className="placeholder" />
                )}
            </div>

            <Card className="details-card">
                <div className="details-header">
                    <div>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>

                    <div>
                        <Badge variant="outline">{capacity} seats</Badge>
                        <Badge
                            variant={statusVariant[status] ?? "secondary"}
                            data-status={status}
                        >
                            {status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="details-grid">
                    <div className="instructor">
                        <p>Instructor</p>
                        {teacher ? (
                            <div>
                                <img
                                    src={teacher.image ?? placeholderUrl}
                                    alt={teacherName}
                                />
                                <div>
                                    <p>{teacherName}</p>
                                    <p>{teacher.email}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No instructor assigned</p>
                        )}
                    </div>

                    <div className="department">
                        <p>Department</p>
                        {department ? (
                            <div>
                                <p>{department.name}</p>
                                <p>{department.description}</p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No department assigned</p>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="subject">
                    <p>Subject</p>
                    {subject ? (
                        <div>
                            <Badge variant="outline">
                                Code: <span>{subject.code}</span>
                            </Badge>
                            <p>{subject.name}</p>
                            <p>{subject.description}</p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No subject assigned</p>
                    )}
                </div>

                <Separator />

                <div className="join">
                    <h2>Join Class</h2>
                    <ol>
                        <li>Ask your teacher for the invite code.</li>
                        <li>Click on &quot;Join Class&quot; button.</li>
                        <li>Paste the code and click &quot;Join&quot;</li>
                    </ol>
                </div>

                <Button size="lg" className="w-full">
                    Join Class
                </Button>
            </Card>
        </ShowView>
    );
};

export default Show;